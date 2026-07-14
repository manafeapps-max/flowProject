import {
  AbstractPowerSyncDatabase,
  BaseObserver,
  CrudEntry,
  PowerSyncBackendConnector,
  UpdateType,
  type PowerSyncCredentials
} from '@powersync/web';

import { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export type SupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  powersyncUrl: string;
};

// Postgres Response codes that we cannot recover from by retrying.
const FATAL_RESPONSE_CODES = [
  // Class 22 — Data Exception
  new RegExp('^22...$'),
  // Class 23 — Integrity Constraint Violation
  new RegExp('^23...$'),
  // INSUFFICIENT PRIVILEGE - typically a row-level security violation
  new RegExp('^42501$')
];

export type SupabaseConnectorListener = {
  initialized: () => void;
  sessionStarted: (session: Session) => void;
};

export class SupabaseConnector extends BaseObserver<SupabaseConnectorListener> implements PowerSyncBackendConnector {
  readonly client: SupabaseClient;
  readonly config: SupabaseConfig;

  ready: boolean;
  currentSession: Session | null;

  constructor() {
    super();
    // Gunakan Next.js environment variables
    this.config = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      powersyncUrl: process.env.NEXT_PUBLIC_POWERSYNC_URL!,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    };

    this.client = supabase;
    this.currentSession = null;
    this.ready = false;
  }

  async init() {
    if (this.ready) {
      return;
    }

    const sessionResponse = await this.client.auth.getSession();
    this.updateSession(sessionResponse.data.session);

    this.ready = true;
    this.iterateListeners((cb) => cb.initialized?.());
  }

  async login(username: string, password: string) {
    const {
      data: { session },
      error
    } = await this.client.auth.signInWithPassword({
      email: username,
      password: password
    });

    if (error) {
      throw error;
    }

    this.updateSession(session);
  }

  async fetchCredentials(): Promise<PowerSyncCredentials> {
    if (typeof window !== 'undefined') {
      (window as any).__powersync_fetch_credentials_called = 'YES';
    }
    try {
      const {
        data: { session },
        error
      } = await this.client.auth.getSession();

      if (typeof window !== 'undefined') {
        (window as any).__powersync_connector_session = session ? 'HAS_SESSION' : 'NO_SESSION';
      }

      if (!session || error) {
        throw new Error(`Could not fetch Supabase credentials: ${error}`);
      }

      console.debug('Session expires at', session.expires_at);

      return {
        endpoint: this.config.powersyncUrl,
        token: session.access_token ?? ''
      } satisfies PowerSyncCredentials;
    } catch (err: any) {
      if (typeof window !== 'undefined') {
        (window as any).__powersync_fetch_credentials_error = err?.message || String(err);
      }
      throw err;
    }
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    let lastOp: CrudEntry | null = null;
    try {
      console.log('Uploading transaction to Supabase:', transaction.crud);
      for (const op of transaction.crud) {
        lastOp = op;
        const table = this.client.from(op.table);
        let result: any;

        switch (op.op) {
          case UpdateType.PUT:
            const record = { ...op.opData, id: op.id };
            console.log(`[Supabase PUT] Table: ${op.table}, ID: ${op.id}`, record);
            result = await table.upsert(record);
            break;
          case UpdateType.PATCH:
            console.log(`[Supabase PATCH] Table: ${op.table}, ID: ${op.id}`, op.opData);
            result = await table.update(op.opData ?? {}).eq('id', op.id);
            break;
          case UpdateType.DELETE:
            console.log(`[Supabase DELETE] Table: ${op.table}, ID: ${op.id}`);
            result = await table.delete().eq('id', op.id);
            break;
        }

        console.log(`[Supabase Result]`, result);
        if (result.error) {
          console.error('Supabase Error details:', result.error);
          result.error.message = `Could not update Supabase. Received error: ${result.error.message}`;
          throw result.error;
        }
      }

      await transaction.complete();
    } catch (ex: any) {
      console.error('Caught exception in uploadData:', ex);

      if (typeof ex.code == 'string' && FATAL_RESPONSE_CODES.some((regex) => regex.test(ex.code))) {
        console.error('Data upload error - discarding:', lastOp, ex);
        await transaction.complete();
      } else {
        throw ex;
      }
    }
  }

  updateSession(session: Session | null) {
    this.currentSession = session;
    if (!session) {
      return;
    }
    this.iterateListeners((cb) => cb.sessionStarted?.(session));
  }
}
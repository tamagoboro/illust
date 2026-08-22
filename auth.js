const AuthApp = {
    async getUser() {
        const client = getSupabase();
        if (!client) return null;
        const { data: { session } } = await client.auth.getSession();
        return session ? session.user : null;
    },

    async signUpWithEmail(email, password) {
        const client = getSupabase();
        if (!client) throw new Error("Supabase is not initialized");
        const { data, error } = await client.auth.signUp({ email, password });
        if (error) throw error;
        return data.user;
    },

    async loginWithEmail(email, password) {
        const client = getSupabase();
        if (!client) throw new Error("Supabase is not initialized");
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    },

    async logout() {
        const client = getSupabase();
        if (client) await client.auth.signOut();
        window.location.reload();
    }
};

const LocalDB = {
    async getMyFormsAsync() {
        const user = await AuthApp.getUser();
        if (!user) return [];
        const client = getSupabase();
        const { data, error } = await client
            .from('forms')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
        if (error) { console.error(error); return []; }
        return data || [];
    },

    async saveFormSettingsAsync(payload) {
        const client = getSupabase();
        if (!client) return false;

        // 編集時：すでにIDが存在する場合はUPDATEを実行
        if (payload.id) {
            const { error } = await client
                .from('forms')
                .update(payload)
                .eq('id', payload.id)
                .eq('user_id', payload.user_id);

            if (error) { console.error("Update Error:", error); return false; }
            return true;
        }

        // 新規作成時：UPSERTを実行
        const { error } = await client
            .from('forms')
            .upsert(payload, { onConflict: 'handle' });

        if (error) { console.error("Upsert Error:", error); return false; }
        return true;
    },

    async deleteFormAsync(id) {
        const client = getSupabase();
        if (!client) return false;
        const { error } = await client
            .from('forms')
            .delete()
            .eq('id', id);
        if (error) { console.error(error); return false; }
        return true;
    },

    async getFormSettingsAsync(handle) {
        const client = getSupabase();
        if (!client) return null;
        const { data, error } = await client
            .from('forms')
            .select('*')
            .eq('handle', handle)
            .maybeSingle(); // ← single() から maybeSingle() に修正してエラー防止
        if (error) return null;
        return data;
    },

    async saveOrderAsync(orderPayload) {
        const client = getSupabase();
        if (!client) return false;
        const { error } = await client
            .from('requests')
            .insert([orderPayload]);
        if (error) { console.error(error); return false; }
        return true;
    },

    async getOrdersAsync() {
        const user = await AuthApp.getUser();
        if (!user) return [];
        const client = getSupabase();
        const { data, error } = await client
            .from('requests')
            .select('*')
            .eq('creator_user_id', user.id)
            .order('created_at', { ascending: false });
        if (error) { console.error(error); return []; }
        return data || [];
    },

    async getClientProjectsAsync(email) {
        const client = getSupabase();
        if (!client || !email) return [];
        const { data, error } = await client
            .from('requests')
            .select('*')
            .eq('client_email', email)
            .order('created_at', { ascending: false });
        if (error) { console.error(error); return []; }
        return data || [];
    },

    async getProfileAsync() {
        const user = await AuthApp.getUser();
        if (!user) return null;
        const client = getSupabase();
        const { data, error } = await client
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle(); // ← single() から maybeSingle() に修正して 406 エラー解消
        if (error) console.error(error);
        return data || null;
    },

    async saveProfileAsync(webhookUrl) {
        const user = await AuthApp.getUser();
        if (!user) return false;
        const client = getSupabase();
        const { error } = await client
            .from('profiles')
            .upsert({
                id: user.id,
                discord_webhook_url: webhookUrl,
                updated_at: new Date().toISOString()
            });
        if (error) { console.error(error); return false; }
        return true;
    },

    async getCreatorWebhookUrlAsync(creatorUserId) {
        const client = getSupabase();
        if (!client || !creatorUserId) return null;
        const { data, error } = await client
            .from('profiles')
            .select('discord_webhook_url')
            .eq('id', creatorUserId)
            .maybeSingle(); // ← single() から maybeSingle() に修正
        if (error) return null;
        return data ? data.discord_webhook_url : null;
    }
};
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
    // 自分の全フォームを取得
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
        return data;
    },

    // フォームの保存・更新
    async saveFormSettingsAsync(payload) {
        const client = getSupabase();
        if (!client) return false;
        const { error } = await client
            .from('forms')
            .upsert(payload, { onConflict: 'handle' });
        if (error) { console.error(error); return false; }
        return true;
    },

    // フォーム1件の削除
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

    // URLハンドルからフォーム取得
    async getFormSettingsAsync(handle) {
        const client = getSupabase();
        if (!client) return null;
        const { data, error } = await client
            .from('forms')
            .select('*')
            .eq('handle', handle)
            .single();
        if (error) return null;
        return data;
    },

    // 回答の送信
    async saveOrderAsync(orderPayload) {
        const client = getSupabase();
        if (!client) return false;
        const { error } = await client
            .from('requests')
            .insert([orderPayload]);
        if (error) { console.error(error); return false; }
        return true;
    },

    // 届いた依頼の取得
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
        return data;
    }
};

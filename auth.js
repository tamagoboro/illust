const AuthApp = {
    async getUser() {
        if (!window.supabaseClient) return null;
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        return user;
    },

    async signUpWithEmail(email, password) {
        if (!window.supabaseClient) throw new Error("Supabaseが初期化されていません");
        const { data, error } = await window.supabaseClient.auth.signUp({ email, password });
        if (error) throw error;
        return data.user;
    },

    async loginWithEmail(email, password) {
        if (!window.supabaseClient) throw new Error("Supabaseが初期化されていません");
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    },

    async logout() {
        if (!window.supabaseClient) return;
        await window.supabaseClient.auth.signOut();
        window.location.reload();
    }
};
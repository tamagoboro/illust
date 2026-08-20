const SUPABASE_URL = "https://hpwyflrnlbifpigddbvz.supabase.co";
const SUPABASE_KEY = "sb_publishable_xIfUW4VuDV2trc__ttRd3w_CTTrTXW2";

if (typeof supabase !== 'undefined') {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

const LocalDB = {
    async saveFormSettingsAsync(payload) {
        try {
            const { error } = await window.supabaseClient
                .from('creator_forms')
                .upsert(payload, { onConflict: 'handle' });
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Save Exception:", e);
            return false;
        }
    },

    async getFormSettingsAsync(handle) {
        try {
            const { data, error } = await window.supabaseClient
                .from('creator_forms')
                .select('*')
                .eq('handle', handle)
                .single();
            if (error) throw error;
            return data;
        } catch (e) {
            console.error("Fetch Exception:", e);
            return null;
        }
    },

    async saveOrderAsync(orderPayload) {
        try {
            const { error } = await window.supabaseClient
                .from('project_orders')
                .insert([orderPayload]);
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Order Save Exception:", e);
            return false;
        }
    },

    async getOrdersAsync() {
        try {
            const user = await AuthApp.getUser();
            if (!user) return [];

            const { data: userForms } = await window.supabaseClient
                .from('creator_forms')
                .select('handle')
                .eq('user_id', user.id);

            if (!userForms || userForms.length === 0) return [];
            const handles = userForms.map(f => f.handle);

            const { data, error } = await window.supabaseClient
                .from('project_orders')
                .select('*')
                .in('handle', handles)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (e) {
            console.error("Fetch Orders Exception:", e);
            return [];
        }
    }
};
const SUPABASE_URL = "https://hpwyflrnlbifpigddbvz.supabase.co";
const SUPABASE_KEY = "sb_publishable_xIfUW4VuDV2trc__ttRd3w_CTTrTXW2";

// グローバルSupabaseクライアントの初期化
if (typeof supabase !== 'undefined') {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}
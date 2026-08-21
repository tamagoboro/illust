const SUPABASE_URL = "https://hpwyflrnlbifpigddbvz.supabase.co";
const SUPABASE_KEY = "sb_publishable_xIfUW4VuDV2trc__ttRd3w_CTTrTXW2";

// 呼び出されたタイミングでSupabaseクライアントを返す関数
function getSupabase() {
    if (!window.supabaseClient) {
        if (typeof supabase === 'undefined') {
            console.error("Supabase CDNが読み込まれていません。");
            return null;
        }
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return window.supabaseClient;
}

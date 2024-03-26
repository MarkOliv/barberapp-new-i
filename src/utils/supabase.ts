import { createClient } from "@supabase/supabase-js";
import Environment from "../env";

const url = Environment.SUPABASE_URL;

const api = Environment.SUPABASE_API;

const supabase = createClient(url, api);

export default supabase;

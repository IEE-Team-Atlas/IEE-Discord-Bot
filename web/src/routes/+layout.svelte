<script>
  import "../app.css";
  import { page } from '$app/stores';
  import { initFlash } from 'sveltekit-flash-message/client';
  import toast, { Toaster } from 'svelte-french-toast';
  import Navbar from "../lib/components/Navbar.svelte";

  const flash = initFlash(page, {
    flashCookieOptions: { sameSite: 'lax', httpOnly: false }
  });
  
  $: if ($flash) {
    switch ($flash.type) {
      case "success":
        toast.success($flash.message, {duration: 5000});
        break;
      case "error":
        toast.error($flash.message, {duration: 5000});
        break;
    }
  }
</script>

<svelte:head>
  <title>IEE Discord</title>
</svelte:head>
<Toaster/>
<div class="flex h-full flex-col">
  <Navbar/>
  <slot/>
</div>
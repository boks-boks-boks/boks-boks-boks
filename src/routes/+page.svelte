<script>
	import { isAuthenticated } from '$lib';
  import { Alert } from "flowbite-svelte";
</script>

<div>
	<h1>Welcome to boks-boks-boks</h1>

    <div class="p-8">
        <Alert>
            <span class="font-medium">Info alert!</span>
            Change a few things up and try submitting again.
        </Alert>
    </div>
	
	{#if $isAuthenticated}
		<p>You are logged in!</p>
		<!-- Add more authenticated user content here -->
	{:else}
		<p>Please login or register to continue</p>
		
		<div class="auth-links">
			<a href="/login">
				<button>Login</button>
			</a>
			<a href="/register">
				<button>Register</button>
			</a>
		</div>
	{/if}
</div>
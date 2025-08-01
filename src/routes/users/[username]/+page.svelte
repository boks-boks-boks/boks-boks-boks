<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getUserProfile, logout as apiLogout } from '$lib/api';
	import { currentUser, isAuthenticated, clearAuth } from '$lib/stores/auth';
	import { Button, Card, Alert } from '$lib';
	
	export let data: { username: string };
	
	let userProfile: any = null;
	let loading = true;
	let error = '';
	let isCurrentUser = false;

	onMount(async () => {
		console.log('Profile page mounted');
		console.log('isAuthenticated:', $isAuthenticated);
		console.log('currentUser:', $currentUser);
		console.log('localStorage auth_token:', localStorage.getItem('auth_token'));
		console.log('localStorage current_user:', localStorage.getItem('current_user'));
		
		// Check if user is authenticated
		if (!$isAuthenticated) {
			console.log('User not authenticated, redirecting to login');
			goto('/login');
			return;
		}

		try {
			// For now, let's create a mock profile since we might not have the backend endpoint
			// In a real app, you would fetch from the server
			userProfile = {
				username: data.username,
				id: 1,
				created_at: new Date().toISOString()
			};
			
			// Check if this is the current user's profile
			if ($currentUser?.username === data.username) {
				isCurrentUser = true;
			}
			
			loading = false;
			console.log('Profile loaded successfully:', userProfile);
		} catch (err: any) {
			console.error('Failed to load user profile:', err);
			error = 'Failed to load user profile. You might not have permission to view this profile.';
			loading = false;
		}
	});

	function handleLogout() {
		try {
			clearAuth();
			goto('/');
		} catch (err) {
			console.error('Logout failed:', err);
			// Still clear auth even if server logout fails
			clearAuth();
			goto('/');
		}
	}

	function formatDate(dateString: string) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{data.username} - Profile | Boks-Boks-Boks</title>
</svelte:head>

<div class="profile-container">
	{#if loading}
		<Card>
			<div class="loading-state">
				<div class="loading-spinner"></div>
				<p>Loading profile...</p>
			</div>
		</Card>
	{:else if error}
		<Alert type="error">{error}</Alert>
		<div class="profile-actions">
			<Button href="/" variant="secondary">
				← Back to Home
			</Button>
		</div>
	{:else if userProfile}
		<!-- Profile Header -->
		<Card shadow="large">
			<div class="profile-header">
				<div class="profile-avatar">
					<span class="avatar-icon">👤</span>
				</div>
				<div class="profile-info">
					<h1 class="profile-name">{userProfile.username}</h1>
					{#if isCurrentUser}
						<span class="current-user-badge">Your Profile</span>
					{/if}
				</div>
			</div>
		</Card>

		<!-- Profile Details -->
		<Card>
			<h2 class="section-title">Profile Information</h2>
			<div class="profile-details">
				<div class="detail-item">
					<span class="detail-label">Username:</span>
					<span class="detail-value">{userProfile.username}</span>
				</div>
				
				{#if userProfile.id}
					<div class="detail-item">
						<span class="detail-label">User ID:</span>
						<span class="detail-value">#{userProfile.id}</span>
					</div>
				{/if}
				
				{#if userProfile.created_at}
					<div class="detail-item">
						<span class="detail-label">Member since:</span>
						<span class="detail-value">{formatDate(userProfile.created_at)}</span>
					</div>
				{/if}
			</div>
		</Card>

		<!-- Storage Stats (placeholder for future features) -->
		<Card>
			<h2 class="section-title">Storage Overview</h2>
			<div class="stats-grid">
				<div class="stat-item">
					<div class="stat-number">0</div>
					<div class="stat-label">Total Boxes</div>
				</div>
				<div class="stat-item">
					<div class="stat-number">0</div>
					<div class="stat-label">Items Stored</div>
				</div>
				<div class="stat-item">
					<div class="stat-number">0</div>
					<div class="stat-label">Categories</div>
				</div>
			</div>
		</Card>

		<!-- Actions -->
		{#if isCurrentUser}
			<Card>
				<h2 class="section-title">Account Actions</h2>
				<div class="profile-actions">
					<Button variant="primary" href="/">
						Manage Boxes
					</Button>
					<Button variant="secondary" on:click={handleLogout}>
						Logout
					</Button>
				</div>
			</Card>
		{:else}
			<div class="profile-actions">
				<Button href="/" variant="secondary">
					← Back to Home
				</Button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.profile-container {
		max-width: 800px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.loading-state {
		text-align: center;
		padding: 3rem 2rem;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f4f6;
		border-left: 4px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.profile-header {
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 1rem 0;
	}

	.profile-avatar {
		flex-shrink: 0;
	}

	.avatar-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 50%;
		font-size: 2.5rem;
		color: white;
	}

	.profile-info {
		flex: 1;
	}

	.profile-name {
		font-size: 2.5rem;
		font-weight: 700;
		color: #1f2937;
		margin: 0 0 0.5rem 0;
	}

	.current-user-badge {
		background: #059669;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 1.5rem 0;
		border-bottom: 2px solid #e5e7eb;
		padding-bottom: 0.5rem;
	}

	.profile-details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		border-bottom: 1px solid #f3f4f6;
	}

	.detail-item:last-child {
		border-bottom: none;
	}

	.detail-label {
		font-weight: 600;
		color: #6b7280;
	}

	.detail-value {
		color: #1f2937;
		font-weight: 500;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 2rem;
		text-align: center;
	}

	.stat-item {
		padding: 1rem;
		background: #f9fafb;
		border-radius: 8px;
	}

	.stat-number {
		font-size: 2rem;
		font-weight: 800;
		color: #3b82f6;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		color: #6b7280;
		font-weight: 500;
	}

	.profile-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	@media (max-width: 640px) {
		.profile-header {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}

		.profile-name {
			font-size: 2rem;
		}

		.detail-item {
			flex-direction: column;
			gap: 0.5rem;
			align-items: flex-start;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.profile-actions {
			flex-direction: column;
		}
	}
</style>

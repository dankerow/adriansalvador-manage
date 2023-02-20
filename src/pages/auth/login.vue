<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

useHead({
	title: 'Login'
})

const authStore = useAuthStore()
const { query } = useRoute()

const email = ref('')
const password = ref('')

watchEffect(async () => {
	if (authStore.user) {
		await navigateTo(query.redirect as string, {
			replace: true
		})
	}
})

const errors = ref()

const login = async () => {
	if (errors.value) {
		errors.value = null
	}

	const { error } = await authStore.login({ email: email.value, password: password.value })

	if (error) {
		errors.value = error
	}
}
</script>

<template>
	<div class="hero">
		<div class="container-fluid g-0">
			<div class="w-100 bg-gradient-dark py-10 py-lg-15 text-center">
				<h1 class="display-1 text-uppercase fw-bold lh-1">
					Adrian Salvador
				</h1>
			</div>
		</div>

		<div class="container-fluid">
			<div class="row justify-content-center mt-n5">
				<div class="col-10 col-sm-12 col-md-10 col-lg-4">
					<div class="card text-bg-darker">
						<div class="card-header">
							<h3 class="card-title mb-0">
								Sign In
							</h3>
							<p class="text-muted fs-5 mb-0">
								Start managing your photos.
							</p>
						</div>

						<div class="card-body">
							<form
								id="loginForm"
								role="form"
								method="post"
								@submit.prevent="login"
							>
								<div class="form-group">
									<div class="input-group">
										<span class="input-group-text">
											<Icon name="ic:twotone-alternate-email" />
										</span>
										<label for="email" />
										<input
											id="email"
											v-model="email"
											class="form-control text-bg-dark"
											placeholder="Email"
											type="email"
											name="email"
											autocomplete="email"
											required
										>
									</div>
								</div>

								<div class="form-group">
									<div class="input-group">
										<span class="input-group-text">
											<Icon name="ic:twotone-password" />
										</span>
										<label for="password" />
										<input
											id="password"
											v-model="password"
											class="form-control text-bg-dark"
											type="password"
											minlength="8"
											maxlength="100"
											name="password"
											placeholder="Password"
											autocomplete="current-password"
											required
										>
									</div>
								</div>

								<div v-if="errors" class="alert alert-danger">
									{{ errors.message ? errors.message : errors }}
								</div>

								<div class="text-center">
									<button class="btn btn-dark" type="submit">
										<Icon name="ic:twotone-log-in" />
										Sign in
									</button>
								</div>
							</form>
						</div>

						<div class="card-footer text-muted text-end">
							by <span class="font-monospace bg-dark px-1 py-1 rounded-1">Folium</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.hero {
	height: 100%;
}
</style>

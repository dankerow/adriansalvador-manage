<template>
	<div>
		<div class="header py-6 py-lg-8 pt-lg-9">
			<div class="container">
				<div class="header-body text-center mb-7">
					<div class="row justify-content-center">
						<div class="col-xl-6 col-lg-8 col-md-10 px-5">
							<h1 class="display-1 text-uppercase fw-bold">
								Adrian Salvador
							</h1>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="container mt-n8">
			<div class="row justify-content-center">
				<div class="col-10 col-sm-12 col-md-10 col-lg-8">
					<div class="card text-bg-dark">
						<div class="card-header">
							<h3 class="mb-0">
								Sign In
							</h3>
							<p class="fs-5 mb-0">
								Hehe
							</p>
						</div>

						<div class="card-body">
							<form
								id="loginForm"
								role="form"
								method="post"
								@submit.prevent="submitForm"
							>
								<div class="form-group">
									<div class="input-group">
										<span class="input-group-text">
											<EnvelopeIcon />
										</span>
										<label for="email" />
										<input
											id="email"
											v-model="form.email"
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
											<LockIcon />
										</span>
										<label for="password" />
										<input
											id="password"
											v-model="form.password"
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

								<div class="text-center">
									<button class="btn btn-primary" type="submit">
										<SignInAltIcon />
										Sign in
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {
		EnvelopeIcon: () => import('~/assets/icons/envelope.svg?inline'),
		LockIcon: () => import('~/assets/icons/lock.svg?inline'),
		SignInAltIcon: () => import('~/assets/icons/sign-in-alt.svg?inline')
	},
	layout: 'login',
	middleware: 'auth',
	data() {
		return {
			form: {
				email: null,
				password: null
			}
		}
	},
	head: {
		title: 'Login'
	},
	methods: {
		submitForm() {
			try {
				this.$store.dispatch('auth/login', { ...this.form })
					.then(() => {
						this.$router.push('/')
					})
					.catch((e) => {
						this.$nuxt.error({
							statusCode: 500,
							message: e
						})
					})
			} catch (e) {
				console.log(e.message)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.logo {
	height: auto;
	width: 256px;
}
</style>

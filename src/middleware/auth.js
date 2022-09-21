export default function({ store, redirect }) {
	const isLoggedIn = store.state.auth.loggedIn

	if (!isLoggedIn) {
		return redirect(301, '/auth/login')
	}

	return true
}

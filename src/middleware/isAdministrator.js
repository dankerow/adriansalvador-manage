export default function({ store, redirect }) {
	if (store.state.auth.loggedIn && !store.state.auth.user.permissions.administrator) {
		return redirect('/auth/login')
	}
}

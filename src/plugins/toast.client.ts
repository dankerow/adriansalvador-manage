export default defineNuxtPlugin(() => {
	class Toast {
		constructor({ title, body, show = true }: { title: string, body: string, show?: boolean }) {
			let toastElement = this._create({ title, body })

			this._appendToToastContainer(toastElement)

			toastElement = this._initToast(toastElement)

			if (show) {
				this._show(toastElement)
			}
		}

		_create({ title, body }: { title: string, body: string }): HTMLElement {
			const toastElement = document.createElement('div')
			toastElement.setAttribute('role', 'alert')
			toastElement.setAttribute('aria-live', 'assertive')
			toastElement.setAttribute('aria-atomic', 'true')
			toastElement.setAttribute('class', 'toast')
			toastElement.setAttribute('data-bs-autohide', 'false')

			const toastHeaderElement = document.createElement('div')
			toastHeaderElement.setAttribute('class', 'toast-header')

			const toastTitleElement = document.createElement('strong')
			toastTitleElement.setAttribute('class', 'me-auto')
			toastTitleElement.appendChild(document.createTextNode(title))
			toastHeaderElement.appendChild(toastTitleElement)

			const toastTimeElement = document.createElement('small')
			toastTimeElement.appendChild(document.createTextNode('11 mins ago'))
			toastHeaderElement.appendChild(toastTimeElement)

			const button = document.createElement('button')
			button.setAttribute('type', 'button')
			button.setAttribute('class', 'btn-close')
			button.setAttribute('data-bs-dismiss', 'toast')
			button.setAttribute('aria-label', 'Close')
			toastHeaderElement.appendChild(button)
			toastElement.appendChild(toastHeaderElement)

			const toastBodyElement = document.createElement('div')
			toastBodyElement.setAttribute('class', 'toast-body')
			toastBodyElement.appendChild(document.createTextNode(body))
			toastElement.appendChild(toastBodyElement)

			return toastElement
		}

		_initToast(element: HTMLElement) {
			return new bootstrap.Toast(element)
		}

		_appendToToastContainer(element: HTMLElement) {
			const toastContainer = document.querySelector('.toast-container')
			toastContainer?.appendChild(element)
		}

		_show(bootstrapElement) {
			bootstrapElement.show()
		}
	}

	return {
		provide: {
			toast: Toast
		}
	}
})

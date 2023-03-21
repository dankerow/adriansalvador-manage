<script setup lang="ts">
defineProps<{
	title: string
	icon?: string
	buttons?: {
		name: string
		text: string
		icon?: string
		url?: string
		callback?:() => void
	}[]
	body?: {
		class?: string
	}
}>()

const colorMode = useColorMode()
const slots = useSlots()
</script>

<template>
	<div
		class="banner pt-4 pb-6"
		:class="{ 'bg-dark': colorMode.value === 'dark', 'bg-primary': colorMode.value === 'light' }"
	>
		<div class="container-fluid">
			<div class="row align-items-center">
				<div class="col-12 col-md-6 col-lg-4">
					<div v-if="icon" class="icon icon-shape me-2 shadow-sm" :class="{ 'icon-shape-darker': colorMode.value === 'dark', 'icon-shape-primary': colorMode.value === 'light' }">
						<Icon :name="icon" />
					</div>
					<h3 class="fw-bolder text-uppercase d-inline-block mb-0">
						{{ title }}
					</h3>
				</div>

				<div v-if="buttons?.length" class="col-12 col-md-6 col-lg-8 text-end">
					<template v-for="button in buttons">
						<NuxtLink
							v-if="button.url"
							:key="button.name"
							:to="button.url"
							class="btn btn-sm"
							:class="{ 'btn-primary': colorMode.value === 'dark', 'btn-white': colorMode.value === 'light' }"
						>
							{{ button.text }}
						</NuxtLink>
						<button
							v-else
							:key="button.name"
							class="btn btn-sm"
							:class="{ 'btn-primary': colorMode.value === 'dark', 'btn-white': colorMode.value === 'light' }"
							@click="button.callback"
						>
							{{ button.text }}
						</button>
					</template>
				</div>
			</div>

			<div v-if="slots.body" :class="body?.class ?? 'row mt-4'">
				<slot name="body" />
			</div>
		</div>
	</div>
</template>

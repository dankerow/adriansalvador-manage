<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  icon: {
    name: string;
    color?: string;
    url?: string;
  };
}

withDefaults(defineProps<Props>(), {
  icon: () => ({ name: 'fluent:border-none-24-filled', color: 'blue' })
})
</script>

<template>
  <div class="card card-stats shadow-sm">
    <div class="card-body">
      <div class="row">
        <div class="col-auto">
          <NuxtLink v-if="icon.url" :to="icon.url" :aria-label="title">
            <div :class="`icon icon-shape icon-shape-${icon.color}`">
              <Icon :name="icon.name" />
            </div>
          </NuxtLink>

          <div v-else :class="`icon icon-shape icon-shape-${icon.color}`">
            <Icon :name="icon.name" />
          </div>
        </div>

        <div class="col">
          <h6 class="card-title text-uppercase text-body-secondary mb-0">
            {{ title }}
          </h6>

          <p class="text-capitalize fw-bold mb-0">
            {{ description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-stats {
	&:not(:first-child) {
		margin-bottom: 1.5rem;
	}

	.card-body {
		padding: 1.5rem 1rem;
	}
}
</style>

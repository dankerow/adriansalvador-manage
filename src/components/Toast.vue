<script lang="ts">
import { Transition } from 'vue'

export default {
  props: {
    autohide: {
      type: Boolean,
      default: true,
    },
    color: String,
    delay: {
      type: Number,
      default: 5000,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    index: Number,
    title: String,
    body: {
      type: String,
      required: true,
    },
    visible: Boolean,
  },
  emits: [
    'close',
    'show',
  ],
  setup(props, { emit }) {
    const createdAt = new Date()
    const timeout = ref(0)
    const visible = ref()

    const updateVisible = (_visible: boolean) => {
      visible.value = _visible
    }

    provide('updateVisible', updateVisible)

    onMounted(() => {
      if (props.visible) {
        visible.value = props.visible
      }

      if (props.autohide) {
        clearTimeout(timeout.value)
        timeout.value = window.setTimeout(() => {
          visible.value = false
          emit('close')
        }, props.delay)
      }
    })

    return () =>
      h(
        Transition,
        {
          appear: true,
          enterFromClass: '',
          enterActiveClass: 'show showing',
          enterToClass: 'show',
          leaveFromClass: 'show',
          leaveActiveClass: 'show showing',
          leaveToClass: 'show',
          onAfterEnter: (el) => {
            el.classList.add('show')
            props.index ? emit('show', props.index) : emit('show')
          },
          onAfterLeave: () => {
            props.index ? emit('close', props.index) : emit('close')
          },
        },
        {
          default: () =>
            visible.value &&
            h(
              'div',
              {
                class: [
                  'toast fade',
                  {
                    [`bg-${props.color}`]: props.color,
                  },
                ],
                'aria-live': 'assertive',
                'aria-atomic': true,
                role: 'alert',
              },
              [
                h('div', { class: 'toast-header' }, [
                  props.title && h('strong', { class: 'me-auto' }, props.title),
                  h(
                    'small',
                    {
                      class: 'text-muted',
                    },
                    useTimeAgo(createdAt),
                  ),
                  props.dismissible &&
                  h(
                    'button',
                    {
                      type: 'button',
                      class: 'btn-close',
                      'data-bs-dismiss': 'toast',
                      'aria-label': 'Close',
                      onClick: () => {
                        visible.value = false
                        emit('close')
                      },
                    },
                    null,
                  ),
                ]),
                h('div', { class: 'toast-body' }, props.body)
              ]
            ),
        },
      )
  },
}
</script>

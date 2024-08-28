const breakpoints = {
  xs: {
    from: 320,
    to: 600,
  },
  sm: {
    from: 601,
    to: 800,
  },
  md: {
    from: 801,
    to: 1280,
  },
  lg: {
    from: 1281,
    to: 1920,
  },
  xl: {
    from: 1921,
    to: 2560,
  },
}

export const xs = computed({
  get() {
    return window.innerWidth >= breakpoints.xs.from && window.innerWidth <= breakpoints.xs.to
  }
})

export const sm = computed({
  get() {
    return window.innerWidth >= breakpoints.sm.from && window.innerWidth <= breakpoints.sm.to
  }
})
export const smAndUp = computed({
  get() {
    return window.innerWidth >= breakpoints.sm.from
  }
})
export const smAndDown = computed({
  get() {
    return window.innerWidth <= breakpoints.sm.to
  }
})

export const md = computed({
  get() {
    return window.innerWidth >= breakpoints.md.from && window.innerWidth <= breakpoints.md.to
  }
})
export const mdAndUp = computed({
  get() {
    return window.innerWidth >= breakpoints.md.from
  }
})
export const mdAndDown = computed({
  get() {
    return window.innerWidth <= breakpoints.md.to
  }
})

export const lg = computed({
  get() {
    return window.innerWidth >= breakpoints.lg.from && window.innerWidth <= breakpoints.lg.to
  }
})
export const lgAndUp = computed({
  get() {
    return window.innerWidth >= breakpoints.lg.from
  }
})
export const lgAndDown = computed({
  get() {
    return window.innerWidth <= breakpoints.lg.to
  }
})

export const xl = computed({
  get() {
    return window.innerWidth >= breakpoints.xl.from && window.innerWidth <= breakpoints.xl.to
  }
})
export const xlAndUp = computed({
  get() {
    return window.innerWidth >= breakpoints.xl.from
  }
})
export const xlAndDown = computed({
  get() {
    return window.innerWidth <= breakpoints.xl.to
  }
})
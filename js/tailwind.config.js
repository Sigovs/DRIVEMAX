/* Tailwind Play CDN config — maps brand tokens (css vars in css/tokens.css)
   to Tailwind utilities. Load AFTER the CDN script, BEFORE </head>.
   Lets you use bg-navy, text-blue, rounded-field, font-display, etc. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        base: 'var(--color-base)',
        surface: 'var(--color-surface)',
        section: 'var(--color-section)',
        border: 'var(--color-border)',
        ink: 'var(--color-ink)',
        body: 'var(--color-body)',
        muted: 'var(--color-muted)',
        faint: 'var(--color-faint)',
        navy: 'var(--color-navy)',
        blue: 'var(--color-blue)',
        cyan: 'var(--color-cyan)',
        'blue-soft': 'var(--color-blue-soft)',
        amber: 'var(--color-amber)',
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      // Only design-system radii. Use these — no arbitrary values.
      borderRadius: {
        none: '0',
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        field: 'var(--radius-field)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      maxWidth: { container: 'var(--container)' },
      spacing: { '3xl': 'var(--space-3xl)' },  // 128px — large section gap
    },
  },
}

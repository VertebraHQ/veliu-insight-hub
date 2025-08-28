import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Outfit', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'SF Pro Display', 'Helvetica', 'Arial', 'sans-serif'],
				'mono': ['SF Mono', 'Fira Code', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
				'display': ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'SF Pro Display', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				analytics: {
					blue: {
						DEFAULT: 'hsl(var(--analytics-blue))',
						light: 'hsl(var(--analytics-blue-light))'
					},
					green: {
						DEFAULT: 'hsl(var(--analytics-green))',
						light: 'hsl(var(--analytics-green-light))'
					},
					orange: {
						DEFAULT: 'hsl(var(--analytics-orange))',
						light: 'hsl(var(--analytics-orange-light))'
					},
					red: {
						DEFAULT: 'hsl(var(--analytics-red))',
						light: 'hsl(var(--analytics-red-light))'
					},
					purple: {
						DEFAULT: 'hsl(var(--analytics-purple))',
						light: 'hsl(var(--analytics-purple-light))'
					}
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				dashboard: {
					surface: 'hsl(var(--dashboard-surface))',
					'surface-hover': 'hsl(var(--dashboard-surface-hover))',
					border: 'hsl(var(--dashboard-border))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			boxShadow: {
				'card': 'var(--shadow-card)',
				'card-hover': 'var(--shadow-card-hover)',
				'copper-glow': '0 0 20px rgba(234, 88, 12, 0.3)',
				'copper-glow-hover': '0 0 30px rgba(234, 88, 12, 0.5)',
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
				'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.5)'
			},
			transitionProperty: {
				'smooth': 'var(--transition-smooth)'
			},
			backdropBlur: {
				'glass': '20px'
			},
			backdropSaturate: {
				'glass': '180%'
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-gentle': 'bounce 2s infinite',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

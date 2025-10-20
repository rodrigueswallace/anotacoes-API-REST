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
		screens: {
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
			'tablet': '868px',
			'h-lg': { 'raw': '(min-height: 670px)' }
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Legacy colors for compatibility
				primary: {
					DEFAULT: 'hsl(var(--main-primary))',
					foreground: 'hsl(var(--main-white))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--main-secondary))',
					foreground: 'hsl(var(--main-white))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--main-danger))',
					foreground: 'hsl(var(--main-white))'
				},
				muted: {
					DEFAULT: 'hsl(var(--light-black))',
					foreground: 'hsl(var(--second-black))'
				},
				accent: {
					DEFAULT: 'hsl(var(--light-primary))',
					foreground: 'hsl(var(--main-primary))'
				},
				popover: {
					DEFAULT: 'hsl(var(--main-white))',
					foreground: 'hsl(var(--main-black))'
				},
				card: {
					DEFAULT: 'hsl(var(--main-white))',
					foreground: 'hsl(var(--main-black))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--main-white))',
					foreground: 'hsl(var(--main-black))',
					primary: 'hsl(var(--main-primary))',
					'primary-foreground': 'hsl(var(--main-white))',
					accent: 'hsl(var(--light-primary))',
					'accent-foreground': 'hsl(var(--main-primary))',
					border: 'hsl(var(--second-white))',
					ring: 'hsl(var(--main-primary))'
				},

				// Design System Colors - [Grupo]/[Categoria] pattern
				'main-primary': 'hsl(var(--main-primary))',
				'light-primary': 'hsl(var(--light-primary))',
				'second-primary': 'hsl(var(--second-primary))',
				
				'main-info': 'hsl(var(--main-info))',
				'light-info': 'hsl(var(--light-info))',
				'second-info': 'hsl(var(--second-info))',
				
				'main-success': 'hsl(var(--main-success))',
				'light-success': 'hsl(var(--light-success))',
				'second-success': 'hsl(var(--second-success))',
				
				'main-warning': 'hsl(var(--main-warning))',
				'light-warning': 'hsl(var(--light-warning))',
				'second-warning': 'hsl(var(--second-warning))',
				
				'main-danger': 'hsl(var(--main-danger))',
				'light-danger': 'hsl(var(--light-danger))',
				'second-danger': 'hsl(var(--second-danger))',
				
				'main-secondary': 'hsl(var(--main-secondary))',
				'light-secondary': 'hsl(var(--light-secondary))',
				'second-secondary': 'hsl(var(--second-secondary))',
				
				'main-dark': 'hsl(var(--main-dark))',
				'light-dark': 'hsl(var(--light-dark))',
				'second-dark': 'hsl(var(--second-dark))',
				
				'main-white': 'hsl(var(--main-white))',
				'light-white': 'hsl(var(--light-white))',
				'second-white': 'hsl(var(--second-white))',
				
				'main-black': 'hsl(var(--main-black))',
				'light-black': 'hsl(var(--light-black))',
				'second-black': 'hsl(var(--second-black))',
				'main-info-dark': 'hsl(var(--main-info-dark))'
			},
			fontFamily: {
				'sora': ['Sora', 'system-ui', '-apple-system', 'sans-serif']
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
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

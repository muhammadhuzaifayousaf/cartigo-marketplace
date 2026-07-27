import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'
import { img } from '../utils/helpers'

const footerCols = [
  {
    title: 'About',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Find store', to: '/products' },
      { label: 'Categories', to: '/products' },
      { label: 'Blogs', to: '/about' },
    ],
  },
  {
    title: 'Partnership',
    links: [
      { label: 'Sell on Cartiqo', to: '/about' },
      { label: 'Affiliate program', to: '/about' },
      { label: 'Advertise', to: '/about' },
      { label: 'Supplier directory', to: '/about' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'Help Center', to: '/about' },
      { label: 'Money Refund', to: '/about' },
      { label: 'Shipping', to: '/about' },
      { label: 'Contact us', to: '/about' },
    ],
  },
  {
    title: 'For users',
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/signup' },
      { label: 'My Orders', to: '/cart' },
      { label: 'Settings', to: '/about' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border-col mt-8">
      {/* Newsletter */}
      <div className="bg-bg-light border-b border-border-col">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h3 className="font-semibold text-text-primary mb-1">Subscribe on our newsletter</h3>
          <p className="text-sm text-text-muted mb-4">
            Get daily news on upcoming offers from many suppliers all over the world
          </p>
          <div className="flex justify-center max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 border border-border-col rounded-l px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button className="btn-primary rounded-l-none px-6">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src={img('logo.png')} alt="Cartiqo" className="h-10" />
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Your one-stop destination for quality products at unbeatable prices. Shop with confidence and enjoy fast, reliable delivery worldwide.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="text-text-muted hover:text-primary transition-colors">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerCols.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-text-primary mb-3 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-text-muted hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Get app */}
          <div>
            <h4 className="font-semibold text-text-primary mb-3 text-sm">Get app</h4>
            <div className="space-y-2">
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="w-32"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="w-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-col">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Cartiqo. All rights reserved.
          </p>
          <button className="text-xs text-text-muted flex items-center gap-1 hover:text-primary">
            <img
              src="https://flagcdn.com/w20/us.png"
              alt="USA"
              className="w-5 h-4 object-cover rounded-sm"
            />
            English
            <span>▲</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

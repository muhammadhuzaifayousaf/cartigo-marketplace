import { Link } from 'react-router-dom'

export default function PromoBanner() {
  return (
    <div className="bg-gradient-to-r from-primary to-blue-700 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-white">
        <h3 className="text-lg md:text-xl font-bold">Super discount on more than 100 USD</h3>
        <p className="text-sm opacity-80 mt-1">Get exclusive deals on bulk orders. Limited time offer for new customers.</p>
      </div>
      <Link
        to="/products"
        className="bg-warning text-white px-6 py-2.5 rounded font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Shop now
      </Link>
    </div>
  )
}

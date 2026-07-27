import { Link } from 'react-router-dom'

export default function DiscountBanner() {
  return (
    <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-white p-8 flex flex-col md:flex-row justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">
          Super discount on more than 100 USD
        </h2>
        <p className="mt-2 text-blue-100">
          Get exclusive deals on bulk orders. Limited time offer for new customers.
        </p>
      </div>
      <Link
        to="/products"
        className="bg-warning hover:opacity-90 px-8 py-3 rounded-lg mt-6 md:mt-0 font-semibold text-sm transition-opacity"
      >
        Shop now
      </Link>
    </div>
  );
}

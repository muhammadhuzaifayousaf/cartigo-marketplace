import {
  Lock,
  MessageCircle,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: <Lock size={22} />,
    title: "Secure payment",
    text: "Your payment information is encrypted and protected with industry-leading security.",
  },
  {
    icon: <MessageCircle size={22} />,
    title: "Customer support",
    text: "Our dedicated support team is available 24/7 to help with any questions.",
  },
  {
    icon: <Truck size={22} />,
    title: "Free delivery",
    text: "Enjoy free shipping on all orders over $50 with real-time tracking.",
  },
];

export default function ServiceFeatures() {
  return (
    <div className="grid md:grid-cols-3 gap-6 my-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-white border border-border-col rounded-lg p-4 hover:shadow-card transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-bg-light flex items-center justify-center text-primary">
            {feature.icon}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">
              {feature.title}
            </h3>
            <p className="text-sm text-text-muted">
              {feature.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

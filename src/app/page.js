import PaymentForm from '../components/PaymentForm';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-2">MOMO Pay</h1>
      <p className="text-purple-200 mb-8">Zidane Mentor Payment Gateway</p>
      <PaymentForm />
    </div>
  );
}
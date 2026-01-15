import { useState } from 'react';

const EMICalculator = ({ price }) => {
  const [downPayment, setDownPayment] = useState(price * 0.1);
  const [loanAmount, setLoanAmount] = useState(price * 0.9);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(36);

  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const n = tenure;

    if (rate === 0) {
      return principal / n;
    }

    const emi = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    return emi;
  };

  const handlePriceChange = (newPrice) => {
    const newDownPayment = newPrice * 0.1;
    const newLoanAmount = newPrice - newDownPayment;
    setDownPayment(newDownPayment);
    setLoanAmount(newLoanAmount);
  };

  const emi = calculateEMI();
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - loanAmount;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">EMI Calculator</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Bike Price: रु{price.toLocaleString()}
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Down Payment: रु{Math.round(downPayment).toLocaleString()}
          </label>
          <input
            type="range"
            min={price * 0.05}
            max={price * 0.5}
            step={1000}
            value={downPayment}
            onChange={(e) => {
              const newDown = parseFloat(e.target.value);
              setDownPayment(newDown);
              setLoanAmount(price - newDown);
            }}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Loan Amount: रु{Math.round(loanAmount).toLocaleString()}
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Interest Rate: {interestRate}% per annum
          </label>
          <input
            type="range"
            min={6}
            max={18}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Loan Tenure: {tenure} months ({Math.round(tenure / 12)} years)
          </label>
          <input
            type="range"
            min={12}
            max={60}
            step={6}
            value={tenure}
            onChange={(e) => setTenure(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="bg-primary-50 p-4 rounded-lg mt-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Monthly EMI</p>
            <p className="text-3xl font-bold text-primary-600">
              रु{Math.round(emi).toLocaleString()}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-semibold">रु{Math.round(totalAmount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Interest</p>
                <p className="font-semibold">रु{Math.round(totalInterest).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;


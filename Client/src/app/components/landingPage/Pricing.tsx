'use client'
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface Feature {
  text: string;
}

interface BasePlan {
  id: number;
  type: string;
  subtitle: string | string[];
  billingCycle: string;
  popular: boolean;
  features: string[];
}

interface StandardPlan extends BasePlan {
  price: string;
  subtitle: string;
}

interface OrganizationPlan extends BasePlan {
  price: string[];
  subtitle: string[];
}

type Plan = StandardPlan | OrganizationPlan;

interface PricingData {
  monthly: Plan[];
  annual: Plan[];
}

const pricingData: PricingData = {
  monthly: [
    {
      id: 1,
      type: 'Local authority',
      price: '$1',
      subtitle: 'General',
      billingCycle: 'Pay per course',
      popular: true,
      features: ['Access single course for 30 days']
    },
    {
      id: 2,
      type: 'Individual',
      price: '$32.40',
      subtitle: 'General',
      billingCycle: 'Monthly',
      popular: false,
      features: ['Access over 18 courses for 30 days']
    }
  ],
  annual: [
    {
      id: 1,
      type: 'Local authority',
      price: '$3000',
      subtitle: 'Custom',
      billingCycle: 'Annually',
      popular: true,
      features: ['Access over 18 courses for 365 days']
    },
    {
      id: 2,
      type: 'Organization',
      price: ['$120', '$150', '$200'],
      subtitle: ['Small organization', 'Medium organization', 'Large organization'],
      billingCycle: 'Annually',
      popular: false,
      features: [
        'Access over 18 courses for 365 days / 100 YP\'s',
        'Access over 18 courses for 365 days / 500 YP\'s',
        'Access over 18 courses for 365 days / Unlimited YP\'s'
      ]
    },
    {
      id: 3,
      type: 'Individual',
      price: '$32.40',
      subtitle: 'General',
      billingCycle: 'Annually',
      popular: false,
      features: ['Access over 18 courses for 365 days']
    }
  ]
};

interface PricingCardProps {
  plan: Plan;
  isOrganization?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isOrganization = false }) => {
  // Type guard to check if this is an organization plan
  const isOrganizationPlan = (plan: Plan): plan is OrganizationPlan => {
    return Array.isArray((plan as OrganizationPlan).price);
  };

  return (
      <div className="bg-white rounded-2xl w-[400px] text-black shadow-sm overflow-hidden border border-gray-300">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800">{plan.type}</h3>
              {!isOrganization ? (
                  <div className="mt-1">
                    <span className="text-4xl font-bold">{isOrganizationPlan(plan) ? plan.price[0] : plan.price}</span>
                    <span className="text-gray-500 ml-2 text-sm">
                  {isOrganizationPlan(plan) ? plan.subtitle[0] : plan.subtitle}
                </span>
                  </div>
              ) : (
                  <div className="space-y-3 mt-3">
                    {isOrganizationPlan(plan) && plan.price.map((price, index) => (
                        <div key={index} className="flex items-baseline">
                          <span className="text-2xl font-bold">{price}</span>
                          <span className="text-gray-500 ml-2 text-sm">{plan.subtitle[index]}</span>
                        </div>
                    ))}
                  </div>
              )}
            </div>
            {plan.popular && (
                <span className="bg-red-100 text-chsprimary text-xs font-medium px-2 py-1 rounded">
              Popular
            </span>
            )}
          </div>

          <p className="text-gray-500 text-sm mb-6">{plan.billingCycle}</p>

          <button className="w-full bg-chsprimary hover:opacity-70 text-white font-medium py-2 px-4 rounded-2xl transition duration-200">
            Get started
          </button>
        </div>

        <div className="border-t border-gray-200 p-6">
          <h4 className="font-bold text-sm uppercase text-gray-700 mb-4">FEATURES</h4>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-chsprimary mr-2 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

type BillingCycle = 'monthly' | 'annual';

const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const handleBillingToggle = (cycle: BillingCycle): void => {
    setBillingCycle(cycle);
  };

  const plans = pricingData[billingCycle];

  return (
      <section className="py-16 text-black mt-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-chsprimary font-medium">Pricing</p>
            <h2 className="text-3xl font-bold mt-2 mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe Untitled should be accessible to all companies, no matter the size.
            </p>

            <div className="inline-flex p-1 mt-8 border border-gray-300 rounded-md bg-white">
              <button
                  className={`px-4 py-2 text-sm font-medium rounded-sm ${
                      billingCycle === 'monthly'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-transparent text-gray-500'
                  }`}
                  onClick={() => handleBillingToggle('monthly')}
              >
                Monthly billing
              </button>
              <button
                  className={`px-4 py-2 text-sm font-medium rounded-sm ${
                      billingCycle === 'annual'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-transparent text-gray-500'
                  }`}
                  onClick={() => handleBillingToggle('annual')}
              >
                Annual billing
              </button>
            </div>
          </div>

          <div className="flex  justify-center flex-wrap gap-8">
            {plans.map((plan) => (
                <div key={plan.id} className={plan.type === 'Organization' ? 'col-span-1' : 'col-span-1'}>
                  <PricingCard
                      plan={plan}
                      isOrganization={plan.type === 'Organization'}
                  />
                </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default PricingSection;
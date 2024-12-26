import React from "react";
import StripeProvider from "./StripeProvider";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useUser, useClerk } from "@clerk/nextjs";
import CoursePreview from "@/components/CoursePreview";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTransactionMutation } from "@/state/api";
import { toast } from "sonner";

const PaymentPageContent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [createTransactions] = useCreateTransactionMutation();
  const { navigateToStep } = useCheckoutNavigation();
  const { course, courseId } = useCurrentCourse();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("stripe service isn't available");
      return;
    }
    const BaseUrl = process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URL
      ? `http://${process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URL}`
      : process.env.NEXT_PUBLIC_PUBLIC_VERCEL_URL
      ? `http://${process.env.NEXT_PUBLIC_PUBLIC_VERCEL_URL}`
      : undefined;
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${BaseUrl}/checkout?step=3&id=${courseId}`,
      },
      redirect: "if_required",
    });
    if (result.paymentIntent?.status === "succeeded") {
      const transactionData: Partial<Transaction> = {
        transactionId: result.paymentIntent.id,
        userId: user?.id,
        courseId: courseId,
        paymentProvider: "stripe",
        amount: course?.price || 0,
      };
      await createTransactions(transactionData);
      navigateToStep(3);
    }
  };

  const handleSignOutAndNavigate = async () => {
    signOut();
    navigateToStep(1);
  };

  if (!course) return null;

  return (
    <div className="payment">
      <div className="payment__container">
        {/* order summery */}
        <div className="payment__preview">
          <CoursePreview course={course} />
        </div>
        {/* payment form */}
        <div className="payment__form-container">
          <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="payment__form"
          >
            <div className="payment__content">
              <h1 className="payment__title">Checkout</h1>
              <p className="payment__subtitle">
                Fill Out The Payment details below to complete the purchase
              </p>
              <div className="payment__method">
                <h3 className="payment__method-title">Payment Method</h3>
                <div className="payment__card-container">
                  <div className="payment__card-header">
                    <CreditCard size={24} />
                    <span>Credit/Debit Card</span>
                  </div>
                  <div className="payment__card-element">
                    <PaymentElement />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* navigation buttons */}
      <div className="payment__actions">
        <Button
          className="hover:bg-white-50/10 bg-transparent"
          onClick={handleSignOutAndNavigate}
          variant="outline"
          type="button"
        >
          Switch Account
        </Button>
        <Button
          className="payment__submit"
          form="payment-form"
          disabled={!stripe || !elements}
          //   onClick={handleSignOutAndNavigate}
          // variant="outline"
          // type="button"
        >
          Pay With Credit card
        </Button>
      </div>
    </div>
  );
};

const PaymentPage = () => (
  <StripeProvider>
    <PaymentPageContent />
  </StripeProvider>
);

export default PaymentPage;

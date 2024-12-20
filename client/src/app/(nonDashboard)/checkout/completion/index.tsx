import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

const CompletionPage = () => {
  return (
    <div className="completion bg-transparent text-white">
      <div className="completion__content">
        <div className="completion__icon">
          <Check className="w-16 h-16" />
        </div>
        <h1 className="completion__title"> 
        COMPLETED
        </h1>
        <p className="completion__message">
        Your order has been successfully processed. Thank you for shopping with us!

        </p>
        
      </div>
      <div>
        <p>
          Need help? Contact Our{" "}
            <Button className = "p-0 m-0 text-primary-700" variant="link" asChild>customer support</Button>
        .</p>
      </div>
      <div className="completion__action">
        <Link href="user/courses">Go To Courses</Link>
      </div>
    </div>
  );
};

export default CompletionPage;

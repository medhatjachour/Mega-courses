"use client";
import Loading from "@/components/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { useGetTransactionsQuery } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";

const TeacherBilling = () => {
  const [paymentType, setPaymentType] = useState("all");
  const { user, isLoaded } = useUser();

  // Fetch transactions data for the current user, only if user data is loaded and user is defined
  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetTransactionsQuery(user?.id || "", {
      skip: !isLoaded || !user,
      // Skip the query if user data is not loaded or user is not defined
    });
  console.log("transactions", transactions); // Log transactions data for debugging
  // Ensure transactions is an array before filtering
  
  // Ensure transactions is an array before filtering
  const filteredData = Array.isArray(transactions)
    ? transactions.filter((transaction) => {
        console.log("transaction", transaction); // Log each transaction for debugging
        console.log("paymentType", paymentType); // Log the paymentType for debugging
        
        // Check if the transaction matches the selected payment type or if 'all' is selected
        const matchesTypes =
          paymentType === "all" || transaction.paymentProvider === paymentType;
          
        console.log("matchesTypes", matchesTypes); // Log the result of the condition
        return matchesTypes;
      })
    : [];

  console.log("filteredData", filteredData); // Log the filtered data for debugging


  if (!isLoaded) return <Loading />;
  if (!user) return <div> please sign in to view ur billing transaction</div>;
  return (
    <div className="billing">
      <div className="billing__container">
        <h2 className="billing__title">Payment History</h2>
        <div className="billing__filters">
          <Select value={paymentType} onValueChange={setPaymentType}>
            <SelectTrigger className="billing__select">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>

            <SelectContent className="billing__select-content">
              <SelectItem className="billing__select-item" value="all">
                All Types
              </SelectItem>
              <SelectItem className="billing__select-item" value="stripe">
                Stripe
              </SelectItem>
              <SelectItem className="billing__select-item" value="paypal">
                Paypal
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="billing__grid">
          {isLoadingTransactions ? (
            <Loading />
          ) : (
            <Table className="billing__table">
              <TableHeader className="billing__table-header">
                <TableRow className="billing__table-header-row">
                  <TableHead className="billing__table-cell">Date</TableHead>
                  <TableHead className="billing__table-cell">Amount</TableHead>
                  <TableHead className="billing__table-cell">
                    Payment Method
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="billing__table-body">
                {filteredData?.length > 0 ? (
                  filteredData?.map((transaction) => (
                    <TableRow
                      className="billing__table-row"
                      key={transaction.transactionId}
                    >
                      <TableCell className="billing__table-cell">
                        {new Date(transaction.dateTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="billing__table-cell billing__amount">
                        {formatPrice(transaction.amount)}
                      </TableCell>
                      <TableCell className="billing__table-cell">
                        {transaction.paymentProvider}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="billing__table-header-row">
                    <TableCell
                      className="billing__table-cell text-center"
                      colSpan={3}
                    >
                      No Transactions to display
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherBilling;

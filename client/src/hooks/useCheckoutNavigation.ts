"use client";
import { useUser } from '@clerk/nextjs' // Import hook to get user information from Clerk
import { useSearchParams ,useRouter} from 'next/navigation' // Import hook to handle URL search parameters
import { useCallback, useEffect } from 'react' // Import hooks for callback and side effects

// Custom hook for managing checkout navigation
export const useCheckoutNavigation = () => {
    const router = useRouter() // Initialize router for navigation
    const searchParams = useSearchParams() // Initialize searchParams to access URL parameters
    const {isLoaded, isSignedIn} = useUser() // Get user state: whether data is loaded and user is signed in

    // Retrieve courseId from URL parameters or set to empty string if not found
    const courseId = searchParams.get('id') ?? "" 
    // Retrieve checkout step from URL parameters or default to 1
    const checkOutStep = parseInt(searchParams.get("step") ?? "1", 10)

    // Function to navigate to a specific step in the checkout process
    const navigateToStep = useCallback(
        (step: number) => {
            const newStep = Math.min(Math.max(1, step), 3) // Ensure step is between 1 and 3
            const showSignUp = isSignedIn ? "true" : "false" // Determine if signup should be shown
            router.push(`/checkout?step=${newStep}&id=${courseId}&showSignUp=${showSignUp}`) // Navigate to the new step
        }, [courseId, isSignedIn, router]
    )

    // Effect to redirect user to step 1 if not signed in and trying to access a higher step
    useEffect(() => {
        if (isLoaded && !isSignedIn && checkOutStep > 1) {
            navigateToStep(1) // Redirect to step 1
        }
    }, [isLoaded, isSignedIn, checkOutStep, navigateToStep])
    return {checkOutStep,navigateToStep }
}

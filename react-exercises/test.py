def memo(n):
    # Use a dictionary to store computed values
    memo_dict = {}

    # Define the recursive function
    def memoRec(n):
        if n in memo_dict:  # Check if the value is already memoized
            return memo_dict[n]
        elif n <= 3:  # Base cases
            memo_dict[n] = n
        else:
            # Compute the value recursively and store it
            memo_dict[n] = memoRec(n - 1) + memoRec(n - 2)
        return memo_dict[n]

    return memoRec(n)  # Call the recursive function

# Test the function
print(memo(5))

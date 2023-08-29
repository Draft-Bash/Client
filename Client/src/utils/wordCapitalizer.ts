export function capitalizeWords(inputString: string) {
    // Split the input string into an array of words
    const words = inputString.split(' ');
  
    // Iterate through the array and capitalize the first letter of each word
    const capitalizedWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  
    // Join the modified array back into a string
    const capitalizedString = capitalizedWords.join(' ');
  
    return capitalizedString;
}
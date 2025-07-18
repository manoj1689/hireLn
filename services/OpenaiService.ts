import { OpenAI } from 'openai';

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // only if you're using it client-side (be cautious!)
});


interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}



export const getChatbotResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    console.log('Sending messages:', messages); // Debugging

    if (messages.length === 0 || !messages.some(msg => msg.role === 'user')) {
      throw new Error('No user message found in the provided messages');
    }

    const userMessage = messages.find(msg => msg.role === 'user')?.content || '';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a highly skilled assistant. Your task is to classify the intent behind a user's input into one of the following categories: "Introduce", "Continue", "User Not Available", "Leave", "Unclear", "Repeat", "Explain", "Move to a new question", "Nervous", "Thinking", "Unable to Answer", "Clarify Question", "Ask for Help", "Confirm Understanding", "Request Timeout", "Give Up", "Request Example", "Apologize", "Acknowledge", "Request Feedback", or "Seek More Time".
          
          Please analyze the user’s message and determine the most appropriate intent from these categories. If the intent is not clear, respond with "Unclear". Here are the possible intents you should classify the message into:
        
          - "Introduce": The user is asking for an introduction or initiating conversation.
          - "Continue": The user’s input is contextually relevant and grammatically correct, indicating a desire to proceed with the current activity. This includes any input containing technical terms, data structures, or variable names related to the content.
          - "User Not Available": The user indicates they are not available for further interaction.
          - "Leave": The user wants to exit the exam or activity.
          - "Unclear": The user's intent is not clear from the message, or the message does not fit any of the other categories.
          - "Explain": The user does not understand the current question and wants more information or clarification about it.
          - "Repeat": The user is requesting to repeat the last message or question.
          - "Move to a new question": The user wants to skip to the next question or topic.
          - "Nervous": The user shows signs of nervousness through hesitation, uncertainty, or repeated pauses.
          - "Thinking": The user is taking time to process or think about their response, often indicated by phrases like "let me think" or longer pauses.
          - "Unable to Answer": The user explicitly states they do not know or cannot answer the question.
          - "Clarify Question": The user is asking for the current question to be rephrased or clarified.
          - "Ask for Help": The user is asking for assistance or guidance in answering the question.
          - "Confirm Understanding": The user is confirming whether they have understood the question or instruction correctly.
          - "Request Timeout": The user is asking to take a break or pause.
          - "Give Up": The user is admitting they cannot answer the question or proceed.
          - "Request Example": The user is asking for an example to better understand the question.
          - "Apologize": The user is apologizing for a mistake or delay in responding.
          - "Acknowledge": The user is acknowledging the message or instruction but not taking further action.
          - "Request Feedback": The user is asking for feedback on their performance or answer.
          - "Seek More Time": The user is asking for additional time to think before answering or proceeding.
        
          Please provide only one of these categories in your response.`
        }
        
        
        ,
        { role: 'user', content: userMessage },
      ],
      max_tokens: 300,
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('No choices available in completion response');
    }

    const choice = completion.choices[0];
    if (!choice.message || !choice.message.content) {
      throw new Error('No content available in choice message');
    }

    let intent = choice.message.content.trim().toLowerCase();

   console.log('Raw intent response:', intent); // Debugging

    // Improved matching logic
    if (intent.includes('continue') ) {
      return 'Continue';
    } else if (intent.includes('leave')) {
      return 'Leave';
    } else if (intent.includes('move to a new question')) {
      return 'Move to a new question';
    } else if (intent.includes('introduce')) {
      return 'Introduce';
    } else if (intent.includes('repeat')) {
      return 'Repeat';
    } else if (intent.includes('explain')) {
      return 'Explain';
    } else if (intent.includes('user not available')) {
      return 'User Not Available';
    }  else {
      return 'Unclear';
    }
  } catch (error) {
    console.error('Error determining intent:', error);
    return 'Error';
  }
};



export const explainChatbotResponse = async (messages: ChatMessage[]): Promise<string | undefined> => {
  console.log('Sending messages:', messages);  // Debugging

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',// Ensure this model is correct for your use case
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: 100,
    });

    console.log('API Response:', response);  // Debugging
    // Ensure content is a string, or return undefined
    return response.choices[0]?.message?.content ?? undefined;
  } catch (error: any) {
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);  // Debugging
    throw new Error('Error fetching response from OpenAI API');
  }
};

export const handleHelpAndSupport = async (messages: ChatMessage[]): Promise<string> => {
  console.log('Processing help and support request:', messages);  // Debugging

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Ensure this model is correct for your use case
      messages: [
        {
          role: 'system',
          content: `You are a highly knowledgeable assistant. Provide a concise and direct answer to the user's query. Focus on delivering the most important information in as few words as possible.`
        },
        ...messages,
      ],
      max_tokens: 100, // Limit the response length
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('No choices available in completion response');
    }

    const choice = completion.choices[0];
    if (!choice.message || !choice.message.content) {
      throw new Error('No content available in choice message');
    }

    return choice.message.content.trim();
  } catch (error) {
    console.error('Error handling help and support:', error);
    return 'Sorry, there was an issue processing your help and support request.';
  }
};

// // Test function to simulate user inputs and log the intent
// const testIntentDetermination = async () => {
//   const testMessages: ChatMessage[][] = [
//     [{ role: 'user', content: 'JavaScript variables are containers for storing data values. Variables can be declared using the "var" keyword. Example: var x = 5; In the above code declaration, the value 5 has been assigned to the variable "x".' }],
//     [{ role: 'user', content: 'Yes, I would like to continue.' }],
//     [{ role: 'user', content: 'Can we move on to the next question?' }],
//     [{ role: 'user', content: 'I\'m not sure what to do next.' }],
//     [{ role: 'user', content: 'Could you tell me more about what happens now?' }],
//   ];

//   for (const messages of testMessages) {
//     try {
//       const intent = await getChatbotResponse(messages);
//       console.log(`Intent for message "${messages[0].content}": ${intent}`);
//     } catch (error) {
//       console.error('Error determining intent:', error);
//     }
//   }
// };

// // Run the test
// testIntentDetermination();

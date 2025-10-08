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
        content: `You are a highly skilled assistant. Your task is to classify the intent behind a user's input into one of the following categories:
        "Positive", "Negative", "Leave", "Introduce", "Repeat", "Explain", "User Not Available", or "Unclear".
        
        Analyze the user's message and determine which intent best matches it.
        If the intent does not clearly fit any category, respond with "Unclear".
        
        Intent Definitions:
        - "Positive": The user's response provides a clear, relevant, and meaningful answer to the question, showing understanding, confidence, or engagement.  

          Examples:
            - "Yes, I have experience with that."
            - "I solved this by optimizing the workflow in my project."
            - "Sure, I can explain my approach."

        - "Negative": The user's response shows disagreement, confusion, uncertainty, or inability to answer. 
          This includes responses with negative or uncertain language such as:
          "no", "I don’t know", "sorry", "not sure", "can’t", "don’t have", "no idea", "nothing", "unable to answer", or any phrase indicating refusal or lack of knowledge.
          Examples: "No", "Sorry, I don’t know", "I can’t answer that", "I’m not sure", "No idea", "Nothing to say".
        
        - "Leave": The user wants to exit, stop, or end the session or interview.
          Examples: "I want to leave", "End this", "Quit", "Stop", "Exit interview".
        
        - "Introduce": The user initiates or asks for an introduction, often at the beginning of the session.
          Examples: "Hi", "Hello", "Who are you?", "What is this interview about?".
        
        - "Repeat": The user requests the previous message or question to be repeated.
          Examples: "Can you repeat that?", "Say that again", "I didn’t hear", "Repeat please".
        
        - "Explain": The user requests further clarification, elaboration, or details about the current question.
          Examples: "Can you explain?", "What do you mean?", "I don’t understand", "Please elaborate".
        
        - "User Not Available": The user indicates they are unavailable or unable to respond.
          Examples: "I’m not here", "Away", "Can’t talk now", "Busy", "Later".
        
        - "Unclear": The user's intent is ambiguous, nonsensical, incomplete, or unrelated to the current context.
          Examples: "bla bla", random characters, or irrelevant messages.

        Respond with exactly one of the above categories.`
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
    if (intent.includes('positive')) {
      return 'Positive';
    } else if (intent.includes('leave')) {
      return 'Leave';
    } else if (intent.includes('negative')) {
      return 'Negative';
    } else if (intent.includes('introduce')) {
      return 'Introduce';
    } else if (intent.includes('repeat')) {
      return 'Repeat';
    } else if (intent.includes('explain')) {
      return 'Explain';
    } else if (intent.includes('user not available')) {
      return 'User Not Available';
    } else {
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

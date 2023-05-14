import { getExplanationAI } from '@/utils/getExplanationAI';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const requestBody = (await req.json()) as any;

    const stream = await getExplanationAI(requestBody.paragraphText);
    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;

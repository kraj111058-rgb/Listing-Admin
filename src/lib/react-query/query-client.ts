import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();


// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5,     // ૫ મિનિટ સુધી ડેટા 'Fresh' ગણાશે (વારંવાર ડેટાબેઝ પર ફોગટના કૉલ્સ નહીં થાય)
//       gcTime: 1000 * 60 * 10,       // ૧૦ મિનિટ સુધી ડેટા બ્રાઉઝરની કેશ મેમરીમાં સચવાશે
//       refetchOnWindowFocus: false,  // બીજી ટેબમાંથી પાછા આ પેજ પર આવીએ ત્યારે વારંવાર રીલોડ ના થાય
//       retry: 1,                     // નેટવર્ક સ્લો હોય તો ૧ વાર ફરી ટ્રાય કરશે
//     },
//   },
// })
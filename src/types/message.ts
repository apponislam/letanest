// export type Message =
//     | { from: string; type?: "text"; text: string; avatar: string }
//     | {
//           from: string;
//           type: "offer";
//           avatar: string;
//           propertyId: string;
//           dates: string;
//           agreedFee: string;
//           bookingFee: string;
//           total: string;
//       };

export type Message =
    // Normal text message
    | {
          from: string;
          type?: "text";
          text: string;
          avatar: string;
      }
    // Offer message
    | {
          from: string;
          type: "offer";
          avatar: string;
          propertyId: string;
          dates: string;
          agreedFee: string;
          bookingFee: string;
          total: string;
      }
    // Accepted offer message
    | {
          from: string;
          type: "accepted";
          avatar: string;
          propertyId: string;
          dates: string;
          total: string;
          propertyName?: string;
          address?: string;
          manager?: string;
          phone?: string;
      }
    // Rejected offer message
    | {
          from: string;
          type: "rejected";
          avatar: string;
          propertyId: string;
          dates: string;
          total: string;
      };

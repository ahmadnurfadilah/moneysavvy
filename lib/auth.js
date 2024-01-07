import { useEffect, useState } from "react";
import { useUserStore } from "./store";
import protocolDefinition from "../public/assets/data/protocol.json";
import categories from "../public/assets/data/category.json";

export function useAuthWeb5() {
  const [myDid, setMyDid] = useState();
  const [myWeb5, setMyWeb5] = useState();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const initWeb5 = async () => {
      const { Web5 } = await import('@web5/api');
      
      const { web5, did } = await Web5.connect();
      setMyDid(did);
      setMyWeb5(web5);
    };
    initWeb5();
  }, [user]);

  useEffect(() => {
    if (!myWeb5 || !myDid) return;
    configureProtocol();
  }, [myDid, myWeb5]);

  const configureProtocol = async () => {
    const { protocols, status } = await myWeb5.dwn.protocols.query({
      message: {
        filter: {
          protocol: protocolDefinition.protocol,
        },
      },
    });

    if (status.code !== 200) {
      console.error("Error querying protocols", status);
      return;
    }

    // if the protocol already exists, we return
    if (protocols.length > 0) {
      // console.log("Protocol already exists");
      return;
    }

    // configure protocol on local DWN
    const { status: configureStatus, protocol } = await myWeb5.dwn.protocols.configure({
      message: {
        definition: protocolDefinition,
      },
    });
    console.log("Protocol configured", configureStatus, protocol);

    const { status: configureRemoteStatus } = await protocol.send(myDid);
    console.log("Protocol configured on remote DWN", configureRemoteStatus);

    setupData();
  };

  const setupData = async () => {
    try {
      for (const c of categories) {
        await myWeb5.dwn.records.create({
          data: {
            "@type": "category",
            author: myDid,
            name: c.name,
            type: c.type,
          },
          message: {
            protocol: protocolDefinition.protocol,
            protocolPath: "category",
            schema: protocolDefinition.types.category.schema,
            dataFormat: protocolDefinition.types.category.dataFormats[0],
          },
        });
      }
      console.log("Success to setup data!");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    did: myDid,
    web5: myWeb5,
  };
}

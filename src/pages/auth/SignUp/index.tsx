import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import React from "react";
import { Link } from "react-router-dom";
import hairFashionLogo from "../../../assets/hairFashion2.png";
import { useAuth } from "../../../contexts";

const SignUP = () => {
  const { sessionUser } = useAuth();
  const router = useIonRouter();

  React.useEffect(() => {
    if (sessionUser) {
      router.push("/app/home");
    }
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="flex flex-col justify-center ion-padding h-screen bg-gray-100">
          <div>
            <img src={hairFashionLogo} alt="" />
          </div>

          <Link to="/login">
            <button className="p-5 w-full rounded-xl bg-gradient-to-l from-green-800 to-green-600 text-white my-3">
              Faça Login
            </button>
          </Link>
          <Link to="register">
            <button className="p-5 w-full rounded-xl bg-gradient-to-l from-green-800 to-green-600 text-white my-3">
              Cadastre-se
            </button>
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUP;

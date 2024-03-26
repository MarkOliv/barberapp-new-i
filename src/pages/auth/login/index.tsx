import { useForm } from "react-hook-form";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonText,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { close, eye, eyeOff } from "ionicons/icons";
import { Link } from "react-router-dom";
import supabase from "../../../utils/supabase";
import React from "react";
import { useAuth } from "../../../contexts";

const Login = () => {
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  const { sessionUser } = useAuth();

  const [showPassword, setshowPassword] = React.useState<boolean>(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Insira um e-mail válido")
      .required("O e-mail é obrigatório"),
    password: Yup.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .required("A senha é obrigatória"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleLogin = async (data: any) => {
    await showLoading();
    try {
      let { user, error } = await supabase.auth.signIn({
        email: data.email,
        password: data.password,
      });

      if (error?.status === 400) {
        await showToast({
          message: "Email ou senha incorretos",
          duration: 2000,
        });
      }

      if (user) {
        document.location.replace("/app/home");
      }
    } catch (error) {
      await showToast({
        message: "erro interno tente novamente mais tarde",
        duration: 2000,
      });
    } finally {
      await hideLoading();
    }
  };

  React.useEffect(() => {
    if (sessionUser) {
      document.location.replace("/app/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="flex flex-col justify-center ion-padding h-screen bg-gray-100">
          <div className="absolute top-3 right-3">
            <Link to="/signup">
              <div className="flex justify-center items-center rounded-full bg-gray-200 w-8 h-8">
                <IonIcon className="w-6 h-6" src={close} />
              </div>
            </Link>
          </div>
          <IonText className="text-6xl font-bold text-black-200 mb-16">
            Bem vindo <br /> de volta!
          </IonText>
          <form onSubmit={handleSubmit(handleLogin)}>
            <IonLabel className="text-gray-600" position="stacked">
              E-mail ou usuário
            </IonLabel>
            <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
              <IonInput
                type="text"
                placeholder="email@email.com"
                autocomplete={"email"}
                {...register("email")}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="email"
              as={<div style={{ color: "red" }} />}
            />
            <IonLabel className="text-gray-600" position="stacked">
              Senha
            </IonLabel>
            <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
              <IonInput
                type={showPassword ? "text" : "password"}
                placeholder="********"
                autocomplete={"new-password"}
                {...register("password")}
              />
              <IonIcon
                onClick={() => {
                  setshowPassword(!showPassword);
                }}
                className="ml-2 text-green-700 w-6 h-6"
                src={showPassword ? eyeOff : eye}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="password"
              as={<div style={{ color: "red" }} />}
            />
            <button
              type="submit"
              className="p-4 w-full rounded-xl text-white my-5 bg-gradient-to-l from-green-800 to-green-700"
            >
              Entrar
            </button>
          </form>

          <p className="text-gray-600 py-3">
            Esqueceu sua senha?{" "}
            <Link className="text-green-700 " to="/forgot-password">
              clique aqui
            </Link>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

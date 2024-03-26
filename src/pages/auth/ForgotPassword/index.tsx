import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useForm } from "react-hook-form";

import * as Yup from "yup";
import supabase from "../../../utils/supabase";

const ForgotPassword = () => {
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Insira um e-mail válido")
      .required("O e-mail é obrigatório"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleResetPassword = async (data: any) => {
    await showLoading();
    try {
      const { data: updateUser, error } =
        await supabase.auth.api.resetPasswordForEmail(data.email, {
          redirectTo: "http://localhost:3000/redefine-password",
        });
      // 404 = user not found
      // 429 = email de validação enviado, você poderáW solicitar outro após 60 segundos

      switch (error?.status) {
        case 404:
          await showToast({
            message: "Email não cadastrado",
            duration: 2000,
          });
          break;
        case 429:
          await showToast({
            message:
              "E-mail de recuperação já enviado, aguarde 60 segundos para solicitar outro",
            duration: 2000,
          });
          break;

        default:
          break;
      }
      if (updateUser) {
        await showToast({
          message: "E-mail de recuperação enviado",
          duration: 2000,
        });
      }
    } catch (error) {
    } finally {
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle className="font-bold">Esqueci senha</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="flex flex-col ion-padding h-screen bg-gray-100">
          <IonText className="text-sm text-gray-500 my-10">
            Para redefinir sua senha, informe sua conta de e-mail cadastrado na
            sua conta e enviaremos um link com instruções.
          </IonText>
          <form onSubmit={handleSubmit(handleResetPassword)}>
            <IonLabel className="text-gray-600" position="stacked">
              E-mail
            </IonLabel>

            <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
              <IonInput
                type="text"
                autocomplete="email"
                placeholder="email@email.com"
                {...register("email")}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="email"
              as={<div style={{ color: "red" }} />}
            />

            <button
              type="submit"
              className="p-5 w-full rounded-xl text-white my-3 bg-gradient-to-l from-green-800 to-green-700"
            >
              Próximo
            </button>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;

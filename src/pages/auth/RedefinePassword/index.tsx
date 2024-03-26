import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { eye } from "ionicons/icons";
import { useForm } from "react-hook-form";

import * as Yup from "yup";
import supabase from "../../../utils/supabase";

const RedefinePassword = () => {
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const router = useIonRouter();

  const schema = Yup.object().shape({
    password: Yup.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .required("A senha é obrigatória"),
    confirmPassword: Yup.string()
      .required("A senha é obrigatória")
      .oneOf([Yup.ref("password")], "As senhas não conferem"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const localStorage: any = window.localStorage.getItem("supabase.auth.token");
  const AcessToken = JSON.parse(localStorage)?.currentSession?.access_token;

  const handleRedefinePassword = async (data: any) => {
    await showLoading();
    try {
      const { data: resetPass, error } = await supabase.auth.api.updateUser(
        AcessToken,
        {
          password: data.password,
        }
      );

      if (error) {
        await showToast({
          message: error.message,
          duration: 2000,
        });
      }

      if (resetPass) {
        await showToast({
          message: "Senha alterada com sucesso",
          duration: 3000,
        }).then(() => {
          router.push("/login");
        });
      }
    } catch (error) {
      await showToast({
        message: `${error}`,
        duration: 2000,
      });
    } finally {
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flex items-center p-5">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/login" />
            </IonButtons>
            <IonTitle className="font-bold">Redefinir senha</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="flex flex-col ion-padding h-screen bg-gray-100">
          <IonText className="text-sm text-gray-500 my-10">
            Preencha os campos abaixo.
          </IonText>
          <form onSubmit={handleSubmit(handleRedefinePassword)}>
            <IonLabel className="text-gray-600" position="stacked">
              Digite sua nova senha
            </IonLabel>

            <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
              <IonInput
                type="password"
                placeholder="**********"
                {...register("password")}
              />
              <IonIcon className="w-6 h-6 text-green-700 " src={eye} />
            </div>
            <ErrorMessage
              errors={errors}
              name="password"
              as={<div style={{ color: "red" }} />}
            />

            <IonLabel className="text-gray-600" position="stacked">
              Repita sua nova senha
            </IonLabel>

            <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
              <IonInput
                type="password"
                placeholder="**********"
                {...register("confirmPassword")}
              />
              <IonIcon className="w-6 h-6 text-green-700 " src={eye} />
            </div>
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              as={<div style={{ color: "red" }} />}
            />

            <button
              type="submit"
              className="p-3 w-full rounded-xl text-white my-3 bg-gradient-to-l from-green-800 to-green-700"
            >
              Próximo
            </button>
          </form>

          <button className="p-3 w-full rounded-xl bg-red-400 text-white my-3">
            Cancelar
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RedefinePassword;

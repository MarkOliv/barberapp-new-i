// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTextarea,
  IonTitle,
  useIonLoading,
  useIonRouter,
  useIonToast,
} from "@ionic/react";

import { Link } from "react-router-dom";

import { chevronBackOutline } from "ionicons/icons";
import { useAuth } from "../../../../contexts";
import { ErrorMessage } from "@hookform/error-message";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import supabase from "../../../../utils/supabase";

const Expenses = () => {
  const { sessionUser } = useAuth();
  const [showToast] = useIonToast();
  const [showLoading, hideLoading] = useIonLoading();

  const router = useIonRouter();

  const schema = Yup.object().shape({
    expense_name: Yup.string()
      .required("Nome da despesa é obrigatório")
      .min(3, "O nome deve ter no minimo 3 caracteres"),
    description: Yup.string()
      .required("Adicione uma descrição da despesa")
      .min(5, "a descrição deve ter no minimo 5 caracteres"),
    total_value: Yup.string().required("Insira o valor da despesa"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleNewExpense = async (data: any) => {
    await showLoading();
    try {
      const { data: expenseData, error } = await supabase
        .from("cashFlow")
        .insert([
          {
            barber_id: sessionUser?.id,
            expense_name: data?.expense_name,
            type: "debit",
            total_value: data?.total_value,
            description: data?.description,
          },
        ]);

      if (expenseData) {
        await showToast({
          position: "top",
          message: "Despesa inserida com sucesso",
          duration: 3000,
        });
        console.log(expenseData);
        document.location.reload();
      }

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    } finally {
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/config/reports"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Adicionar Despesa</IonTitle>
              </Link>
              <div className="py-10 px-5">
                <form onSubmit={handleSubmit(handleNewExpense)}>
                  <IonLabel className="text-gray-600" position="stacked">
                    Nome da Despesa
                  </IonLabel>
                  <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
                    <IonInput
                      type="text"
                      placeholder="Fornecedor Fulano"
                      {...register("expense_name")}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="expense_name"
                    as={<div style={{ color: "red" }} />}
                  />

                  <IonLabel className="text-gray-600" position="stacked">
                    Descrição
                  </IonLabel>
                  <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
                    <IonTextarea
                      placeholder="Descreva sobre oque é esta despesa"
                      {...register("description")}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="description"
                    as={<div style={{ color: "red" }} />}
                  />

                  <IonLabel className="text-gray-600" position="stacked">
                    Valor Total
                  </IonLabel>
                  <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
                    <p className="text-gray-500">R$</p>
                    <IonInput
                      type={"text"}
                      placeholder="50.15"
                      {...register("total_value")}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="total_value"
                    as={<div style={{ color: "red" }} />}
                  />

                  <button
                    type="submit"
                    className="p-4 w-full rounded-xl text-white my-3 bg-gradient-to-l from-green-800 to-green-700"
                  >
                    Adicionar
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
        {sessionUser === null && (
          <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <p className="text-black">você precisa estar logado</p>
            <Link to="/signup" className="text-cyan-500">
              Clique aqui
            </Link>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Expenses;

// @flow
import * as React from "react";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import { useForm } from "react-hook-form";

import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import { chevronBackOutline } from "ionicons/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";

export const EditProduct = () => {
  const [showToast] = useIonToast();

  const id: any = useParams();
  const { sessionUser } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [productId, setProductId] = React.useState(id?.ProductId);
  const [currentProduct, setCurrentProduct] = React.useState<any>();

  const schema = Yup.object().shape({
    name: Yup.string(),
    category: Yup.string(),
    code: Yup.string(),
    price: Yup.string(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleNewProduct = async (data: any) => {
    let name = `${data?.name}`;
    let category = `${data?.category}`;
    let code = `${data?.code}`;
    let price = `${data?.price}`;
    try {
      const { data: newServiceData, error } = await supabase
        .from("products")
        .update([
          {
            name: name.length === 0 ? currentProduct?.name : name,
            category:
              category.length === 0 ? currentProduct?.category : category,
            code: code.length === 0 ? currentProduct?.code : code,
            price: price.length === 0 ? currentProduct?.price : price,
          },
        ])
        .eq("id", productId);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (newServiceData) {
        await showToast({
          position: "top",
          message: "Produto atualizado com sucesso",
          duration: 3000,
        }).then(() => {
          document.location.replace("/app/products/");
        });
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    } finally {
    }
  };

  const getProduct = async () => {
    try {
      let { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId);

      if (product) {
        setCurrentProduct(product[0]);
      }

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  React.useEffect(() => {
    getProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <Link
              to="/app/products"
              className="flex items-center bg-white p-5 border-b h-24"
            >
              <IonIcon className="w-6 h-6" src={chevronBackOutline} />

              <IonTitle className="font-bold">Editar Produto</IonTitle>
            </Link>
            <form
              onSubmit={handleSubmit(handleNewProduct)}
              className="ion-padding"
            >
              <IonLabel className="text-gray-900" position="stacked">
                Nome
              </IonLabel>
              <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                <IonInput
                  type="text"
                  className="placeholder: text-gray-900"
                  placeholder={`${currentProduct?.name}`}
                  {...register("name")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="name"
                as={<div style={{ color: "red" }} />}
              />
              <div className="py-5">
                <IonLabel className="text-gray-900" position="stacked">
                  Categoria
                </IonLabel>

                <IonSelect
                  className="bg-gray-200 rounded-xl placeholder:text-gray-900 mt-3"
                  placeholder={`${currentProduct?.category}`}
                  {...register("category")}
                >
                  <IonSelectOption value="shampoos">Shampoos</IonSelectOption>
                  <IonSelectOption value="condicionadores">
                    Condicionadores
                  </IonSelectOption>
                  <IonSelectOption value="cremes">Cremes</IonSelectOption>
                  <IonSelectOption value="bebidas">Bebidas</IonSelectOption>
                </IonSelect>
                <ErrorMessage
                  errors={errors}
                  name="category"
                  as={<div style={{ color: "red" }} />}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <IonLabel className="text-gray-900" position="stacked">
                    Código do produto
                  </IonLabel>

                  <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                    <IonInput
                      type={"text"}
                      className="placeholder: text-gray-900"
                      placeholder={`${currentProduct?.code}`}
                      {...register("code")}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="code"
                    as={<div style={{ color: "red" }} />}
                  />
                </div>
                <div>
                  <IonLabel className="text-gray-900" position="stacked">
                    Preço
                  </IonLabel>

                  <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                    <IonLabel className="text-gray-400">R$</IonLabel>
                    <IonInput
                      type={"text"}
                      className="placeholder: text-gray-900"
                      placeholder={`${currentProduct?.price}`}
                      {...register("price")}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="price"
                    as={<div style={{ color: "red" }} />}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="p-4 w-full rounded-xl text-white mt-5 bg-gradient-to-l from-green-800 to-green-700"
              >
                SALVAR
              </button>
              <div
                onClick={async () => {
                  const { data, error } = await supabase
                    .from("products")
                    .delete()
                    .eq("id", currentProduct?.id);

                  if (data) {
                    await showToast({
                      position: "top",
                      message: "Deletado com sucesso",
                      duration: 2000,
                    });
                    document.location.replace("/app/products");
                  }
                }}
                className="flex justify-center items-center cursor-pointer p-4 w-full rounded-xl text-white my-3 bg-gradient-to-l from-red-800 to-red-700"
              >
                DELETAR
              </div>
            </form>
          </>
        )}
        {sessionUser === null && (
          <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <p className="text-black">
              você precisa estar logado como profissional
            </p>
            <Link to="/signup" className="text-cyan-500">
              Clique aqui
            </Link>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

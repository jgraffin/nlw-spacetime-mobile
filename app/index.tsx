import { StatusBar } from "expo-status-bar";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";

import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useRouter } from "expo-router";

import blurBg from "../src/assets/bg-blur.png";
import Stripes from "../src/assets/stripes.svg";
import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";
import { styled } from "nativewind";
import React from "react";
import { api } from "../src/lib/api";
import { err } from "react-native-svg/lib/typescript/xml";

const StyledLogo = styled(NLWLogo)

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/fee01b90698ad2939abc",
};

export default function App() {
  const router = useRouter()

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: "fee01b90698ad2939abc",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime ",
      }),
    },
    discovery
  );

  async function handleGithubOauthCode(code: string) {
    const response = await api
        .post("/register", {
          code,
        })

    const { token } = response.data;

    await SecureStore.setItemAsync("token", token);

    router.push('/memories')
        
  }

  React.useEffect(() => {
    // Ensure that the URL provided is correct with your github's app account
    // console.log(makeRedirectUri({
    //   scheme: 'nlwspacetime'
    // }))

    // console.log(response)

    if (response?.type === "success") {
      const { code } = response.params
      handleGithubOauthCode(code)
    }
  }, [response]);



  return (
    <View
      className="flex-1 items-center px-8 py-18"
    >
      <View className="flex-1 items-center justify-center gap-6">
        <StyledLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua Cápsula do Tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar Lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="p-4 text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>

    </View>
  );
}

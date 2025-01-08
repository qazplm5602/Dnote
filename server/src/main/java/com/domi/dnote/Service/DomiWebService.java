package com.domi.dnote.Service;

import com.domi.dnote.DTO.DomiWebAccountDTO;
import com.domi.dnote.Exception.DomiWebException;
import org.springframework.stereotype.Service;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.*;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.regex.Pattern;

@Service
public class DomiWebService {
    private static final String URL = "http://localhost/bbs/ajax.dnotelogin.php";
    private static final String PACKET_NAME = "---||DOMI-PACKET||---";

    public DomiWebAccountDTO getAccountInfo(String token) {
        URL url;
        try {
            url = new URI(URL).toURL();
        } catch (MalformedURLException e) {
            throw new DomiWebException(DomiWebException.Type.URL_PROTOCOL_ERROR);
        } catch (URISyntaxException e) {
            throw new DomiWebException(DomiWebException.Type.URI_ERROR);
        }

        HttpURLConnection connection;
        try {
            connection = (HttpURLConnection) url.openConnection();
        } catch (IOException e) {
            throw new DomiWebException(DomiWebException.Type.IO_ERROR);
        }

        try {
            connection.setRequestMethod("GET");
        } catch (ProtocolException e) {
            throw new DomiWebException(DomiWebException.Type.METHOD_ERROR);
        }

        connection.setRequestProperty("cookie", "PHPSESSID="+ token +";");
        connection.setUseCaches(false);
        connection.setDoInput(true);
        connection.setDoOutput(true);

        try {
            int responseCode = connection.getResponseCode();
            if (responseCode != 200) {
                if (responseCode == 401) // 로그인이 안되어 있음ㅋㅋ
                    return null;
                
                throw new DomiWebException(DomiWebException.Type.TARGET_SERVER_ERROR);
            }

            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder stringBuffer = new StringBuilder();
            String inputLine;

            while ((inputLine = bufferedReader.readLine()) != null)  {
                stringBuffer.append(inputLine);
            }
            bufferedReader.close();

            String response = stringBuffer.toString();
            String[] datas = response.split(Pattern.quote(PACKET_NAME));
            if (datas.length < 2) // 응답이 이상한데?? (이메일, 닉넴)
                throw new DomiWebException(DomiWebException.Type.SERVER_BAD_RESPONSE);

            return DomiWebAccountDTO.builder()
                    .email(datas[0])
                    .name(datas[1])
                    .build();
        } catch (IOException e) {
            throw new DomiWebException(DomiWebException.Type.IO_ERROR);
        }
    }
}

<?php
// This page contains a variety of functions that can be used to access the OpenAI API
$token = '----';

// Display any php errors (for development purposes)
error_reporting(E_ALL);
ini_set('display_errors', '1');

// This is the header containing the authorization token from OpenAI
$tokenHeader = array("Content-Type: application/json", "Authorization: Bearer ".$token);
$domain = 'api.openai.com';
// the following functions run the GET and POST calls
if (!function_exists('http_parse_headers')) {
    function http_parse_headers($raw_headers) {
        $headers = array();
        $key = '';

        foreach(explode("\n", $raw_headers) as $i => $h) {
            $h = explode(':', $h, 2);

            if (isset($h[1])) {
                if (!isset($headers[$h[0]]))
                    $headers[$h[0]] = trim($h[1]);
                elseif (is_array($headers[$h[0]])) {
                    $headers[$h[0]] = array_merge($headers[$h[0]], array(trim($h[1])));
                }
                else {
                    $headers[$h[0]] = array_merge(array($headers[$h[0]]), array(trim($h[1])));
                }

                $key = $h[0];
            }
            else {
                if (substr($h[0], 0, 1) == "\t")
                    $headers[$key] .= "\r\n\t".trim($h[0]);
                elseif (!$key)
                    $headers[0] = trim($h[0]);
            }
        }

        return $headers;
    }
}
function curlGetAI($url) {
    global $token;
    $ch = curl_init($url);
    if (strpos($url, $GLOBALS['domain']) !== false) {
        curl_setopt ($ch, CURLOPT_URL, $url);
    } else {
        curl_setopt ($ch, CURLOPT_URL, 'https://'.$GLOBALS['domain'].'/v1/'.$url);
    }
    curl_setopt ($ch, CURLOPT_HTTPHEADER, $GLOBALS['tokenHeader']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // ask for results to be returned
    curl_setopt($ch, CURLOPT_VERBOSE, 1); //Requires to load headers
    curl_setopt($ch, CURLOPT_HEADER, 1);  //Requires to load headers
    $result = curl_exec($ch);
    // var_dump($result);

    #Parse header information from body response
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $header = substr($result, 0, $header_size);
    $body = substr($result, $header_size);
    $data = json_decode($body);
    curl_close($ch);

    #Parse Link Information
    $header_info = http_parse_headers($header);
    if(isset($header_info['Link'])){
        $links = explode(',', $header_info['Link']);
        foreach ($links as $value) {
            if (preg_match('/^\s*<(.*?)>;\s*rel="(.*?)"/', $value, $match)) {
                $links[$match[2]] = $match[1];
            }
        }
    }
    #Check for Pagination
    if(isset($links['next'])){
        // Remove the API url so it is not added again in the get call
        $next_link = str_replace('https://'.$GLOBALS['domain'].'/v1/', '', $links['next']);
        $next_data = curlGet($next_link);
        $data = array_merge($data,$next_data);
        return $data;
    }else{
        return $data;
    }
}
function curlPostAI($url, $data) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://'.$GLOBALS['domain'].'/v1/'.$url);
    curl_setopt ($ch, CURLOPT_HTTPHEADER, $GLOBALS['tokenHeader']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // ask for results to be returned

    // Send to remote and return data to caller.
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}
function requestCompletion($prompt, $maxTokens=20, $temperature=0) {
    //$apiURL = "https://api.openai.com/v1/completions";
    $apiURL = "completions";
    $params = [
        "model" => "text-davinci-003",
        "prompt" => $prompt,
        "max_tokens" => $maxTokens,
        "temperature"=> $temperature
    ];
    $params = json_encode($params);

    $response = curlPostAI($apiURL, $params);
    var_dump($response);
    echo "<br><br>";

    $response = json_decode($response);

    return $response->choices[0]->text;
}

?>

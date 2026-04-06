using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace TestCases
{
    // Inicio código generado por GitHub Copilot
    [EnableCors("CorsApiMiLicencia")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Global")]
    [Route("servicios/[controller]")]
    public class EmailNotificationsController : ControllerBase
    {
        private readonly IOcelotService _ocelotService;

        public EmailNotificationsController(IOcelotService ocelotService)
        {
            _ocelotService = ocelotService;
        }

        [HttpPost("SendNotificationPse")]
        public async Task<ResponseDTO<ReferenceResponseEmail>> SendNotificationPse([FromBody] NotificationByPin request)
        {
            if (request == null)
                return new ResponseDTO<ReferenceResponseEmail>() { Codigo = -1, Respuesta = "Request no puede ser nulo" };
            return await _ocelotService.SendNotificationPse(request);
        }
    }
    // Fin código generado por GitHub Copilot

    public class ResumenController : ControllerBase
    {
        // Método generado por GitHub Copilot
        // Inicio refactorización/optimización por GitHub Copilot
        private string ValidarUrlMiLicencia(int idOrigenCotizacion, string[] pinDescripcion)
        {
            /// Antonio modificar a un swicht para mejora funcional de nuevos negocios.
            ///
            string resulturl = "";
            switch (idOrigenCotizacion)
            {
                case 1:
                    resulturl = _configuracion.Value.UrlCentro;
                    break;

                case 2:
                    string urlCiudadado = pinDescripcion.Length == 3
                    ? _configuracion.Value.UrlCiudadano
                    : _configuracion.Value.UrlMarketplace + pinDescripcion[3].ToLower();
                    resulturl = urlCiudadado;
                    break;

                case 4:
                    resulturl = _configuracion.Value.UrlNegocio;
                    break;

                default:
                    resulturl = _configuracion.Value.UrlCentro;
                    break;
            }

            return resulturl;
        }
        // Fin refactorización/optimización por GitHub Copilot
    }
}

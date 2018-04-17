using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace webapi
{
    public class Startup
    {        
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            
            //Setup JWT authentication
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwtOptions =>
            {
                //we want the Sign-Up/Sign-In policy URI here
                jwtOptions.MetadataAddress = string.Format("https://login.microsoftonline.com/{0}/v2.0/.well-known/openid-configuration?p={1}",
                    "newazureb2cdemo.onmicrosoft.com",
                    "B2C_1_SignUpIn");

                //Application ID
                jwtOptions.Audience = "e823eb1b-196a-4bde-a9d7-3af6715965b0";

                jwtOptions.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = AuthenticationFailed
                };
            });

            services.AddMvc();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info
                {
                    Version = "v1",
                    Title = "Library API"
                });
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(policy => policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
            );

            app.UseAuthentication();

            app.UseMvc();
            app.UseDefaultFiles();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Library API v1");
            });

            app.UseStaticFiles();
        }

        //Debuggy stuff
        private Task AuthenticationFailed(AuthenticationFailedContext arg)
        {
            var s = $"AuthenticationFailed: {arg.Exception.Message}";
            arg.Response.ContentLength = s.Length;
            arg.Response.Body.Write(Encoding.UTF8.GetBytes(s), 0, s.Length);
            return Task.FromResult(0);
        }
    }
}
